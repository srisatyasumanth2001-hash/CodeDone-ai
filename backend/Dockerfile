# Slim base image — smaller download, smaller attack surface, faster deploys.
# Match this version to whatever Python you've actually been developing with.
FROM python:3.11-slim

WORKDIR /app

# Dependencies copied and installed FIRST — this is the layer-caching
# decision from above. Code changes later won't force a re-install.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the actual application code
COPY . .

# Documentation only — EXPOSE doesn't actually publish the port,
# it just tells anyone reading this file what port the app listens on
EXPOSE 8000

# Shell-form CMD wrapped explicitly in sh -c — this matters specifically
# because Render assigns a port dynamically through the $PORT environment
# variable at runtime, and exec-form CMD (the ["uvicorn", ...] array syntax)
# does NOT perform environment variable substitution at all — $PORT would
# be passed through as the literal four characters "$PORT", and the
# container would crash on startup. Wrapping in sh -c forces a real shell
# to evaluate $PORT first, while still keeping process signal handling
# correct for graceful shutdown.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]