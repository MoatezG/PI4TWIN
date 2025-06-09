FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose FastAPI port
EXPOSE 8000

# NOTE: The model (.h5) is NOT included in git, so you must manually place it in ML_Service before building the Docker image, or mount it as a volume in production.

CMD ["uvicorn", "ml_service:app", "--host", "0.0.0.0", "--port", "8000"]
