FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

RUN apt-get update
RUN pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 80
COPY ./app /app
ENV PYTHONPATH=/
