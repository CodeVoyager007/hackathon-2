FROM python:3.13-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Install system dependencies required for building Python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY pyproject.toml uv.lock .python-version ./

# Install dependencies
RUN uv sync --frozen --no-dev

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

ENV PYTHONPATH=/app

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; import sys; \
    try: \
        response = urllib.request.urlopen('http://localhost:8000/api/health'); \
        if response.getcode() == 200: sys.exit(0); \
        else: sys.exit(1); \
    except Exception: sys.exit(1)"

# Run the application
CMD ["uv", "run", "fastapi", "run", "src/main.py", "--port", "8000", "--host", "0.0.0.0"]
