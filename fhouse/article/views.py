from django.shortcuts import render, get_object_or_404
from .models import SectionArticle, ArticlesSection


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
    title = article.article_title

    context = {
        "article": article,
        "title": title,
    }
    return render(request, "articles/article_detail.html", context)
