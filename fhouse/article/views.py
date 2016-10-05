from django.contrib.contenttypes.models import ContentType
from django.shortcuts import render, get_object_or_404
from .models import SectionArticle, ArticlesSection
from django.http import HttpResponseRedirect

from comments.models import Comment
from comments.forms import CommentForm
from utils.prepare_methods import create_comment_data


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

    context = {
        "article": article,
        "title": title,
        'comments': comments,
        'comment_form': comment_form,
    }
    return render(request, "articles/article_detail.html", context)
