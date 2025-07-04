# Use Python base image
FROM python:3.10-slim

# Set work directory
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source
COPY . .

# Expose Flask port
EXPOSE 5000

# Run app
CMD ["python", "app.py"]
