from __future__ import absolute_import, unicode_literals
from .celery import app


# @app.task
# def add(x, y):
#     return x + y


@app.task
def mul(x, y):
    return x * y


@app.task
def xsum(numbers):
    return sum(numbers)


@app.task
def add(arg1, arg2):
    print(sum(arg1, arg2))
