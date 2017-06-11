import json

from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_protect
from django.views.generic import ListView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import SectionArticle, ArticlesSection
from django.http import HttpResponseRedirect

from comments.models import Comment
from .serializers import SectionArticleSerializer
from comments.forms import CommentForm
from utils.prepare_methods import create_comment_data
from utils.prepare_methods import create_comment, get_comments


# Create your views here.
def gallery_sections(request):  # list items
    sections_set = ArticlesSection.objects.all()
    title = "Articles"

    context = {
        "sections": sections_set,
        "title": title,
    }
    return render(request, "articles/articles_sections.html", context)


def sections_articles(request, slug=None):  # list items
    section = get_object_or_404(ArticlesSection, slug=slug)
    articles = section.articles
    title = section.section_title

    context = {
        "articles": articles,
        "title": title,
    }
    return render(request, "articles/section_articles.html", context)


def article_detail(request, section_slug=None, article_slug=None):  # list items
    count_of_additional_articles = 2
    section = ArticlesSection.objects.filter(slug=section_slug)
    article = SectionArticle.objects.filter(article_section=section, slug=article_slug).first()
    initial_data = {
        "content_type": article.get_content_type,
        "object_id": article.id,
    }
    comment_form = CommentForm(request.POST or None, initial=initial_data)
    if comment_form.is_valid() and request.user.is_authenticated():
        # Replace is MONKEY HACK
        content_type = comment_form.cleaned_data.get("content_type").replace(' ', '')
        new_comment, created = create_comment_data(request=request, content_type=content_type,
                                                   comment_form=comment_form)
        return HttpResponseRedirect(new_comment.content_object.get_absolute_url())

    comments = article.comments
    title = article.article_title

    additional_articles = SectionArticle.objects.filter(article_section=section).order_by('-timestamp')
    elder_additional_articles = additional_articles.filter(timestamp__lt=article.timestamp)
    if len(elder_additional_articles) > count_of_additional_articles:
        prepare_additional_articles = list(elder_additional_articles[:count_of_additional_articles])
    else:
        prepare_additional_articles = SectionArticle.objects.filter(timestamp__lt=article.timestamp).order_by(
            '-timestamp')[:count_of_additional_articles]
    additional_articles = [{"title": article.article_title, "image": article.image.url,
                            "slug": article.get_absolute_url(), "date": str(article.timestamp),
                            "description": article.article_description}
                           for article in prepare_additional_articles]
    context = {
        "additional_articles": json.dumps(additional_articles),
        "instance": article,
        "title": title,
        'comments': comments,
        'comment_form': comment_form,
    }
    return render(request, "articles/article_detail.html", context)


class ArticleList(ListView):
    model = SectionArticle
    template_name = 'articles/articles_list.html'
    context_object_name = 'articles_list'
    first_paginate = 6
    paginate_by = 3
    allow_empty = False

    def get_context_data(self, **kwargs):
        context = super(ArticleList, self).get_context_data(**kwargs)
        section = self.request.GET.get('section')
        self.paginate_by = self.get_paginate_by(None)
        if section:
            articles = SectionArticle.objects.filter(article_section__section_title=section)
            paginator = Paginator(articles, self.paginate_by)
            page = self.request.GET.get('page')
            print('SECTION PAGE IS: ', page)
            try:
                articles = paginator.page(page)
                print('done1')
            except PageNotAnInteger:
                articles = paginator.page(1)
                print('done2')
            except EmptyPage:
                articles = []
                # articles = paginator.page(paginator.num_pages)
                print('done3')
        else:
            articles = SectionArticle.objects.all()
            paginator = Paginator(articles, self.paginate_by)
            page = self.request.GET.get('page', 1)
            print('PAGE IS: ', page)
            try:
                articles = paginator.page(page)
            except EmptyPage as e:
                articles = []
                # If page is out of range (e.g. 9999), deliver last page of results.
                # articles = paginator.page(paginator.num_pages)
        context['articles_list'] = articles
        return context

    def get_paginate_by(self, queryset):
        """
        Paginate by specified value in querystring, or use default class property value.
        """
        if 'page' in self.request.GET:
            return self.paginate_by
        else:
            return self.first_paginate


class MainPageArticlesList(ListView):
    model = SectionArticle
    template_name = 'articles/main_articles_list.html'
    context_object_name = 'articles_list'

    def get_queryset(self):
        sections = ArticlesSection.objects.all()
        last_articles = []
        for section in sections:
            last_articles.append(section.articles.order_by('-timestamp')[0])
        return last_articles


@csrf_protect
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_comment(request):
    content_type = ContentType.objects.get_for_model(SectionArticle)
    content_type = str(content_type).replace(" ", "")
    new_comment = create_comment(content_type, request)
    return Response(status=200)


@api_view(['GET'])
def get_article_comments(request):
    return get_comments(request, SectionArticle)


@api_view(['GET'])
def get_section_articles(request):
    first_paginate = 6
    paginate_by = 3
    page = request.GET.get("page", 1)
    section = request.GET.get('section', -1)  # get section id
    if section != -1:
        articles = SectionArticle.objects.filter(article_section__id=section)
    else:
        articles = SectionArticle.objects.all()

    total_count = articles.count()
    paginator = Paginator(articles, first_paginate if page == 1 else paginate_by)
    try:
        articles = paginator.page(page)
    except PageNotAnInteger:
        articles = paginator.page(1)
    except EmptyPage:
        articles = []

    article_serializer = SectionArticleSerializer(articles, many=True, context={'request': request})
    return Response(
        {
            "amount": total_count,
            "list": article_serializer.data
        }
    )
