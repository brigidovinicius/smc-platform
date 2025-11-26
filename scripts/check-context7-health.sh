#!/usr/bin/env bash

set -euo pipefail

APP_URL="${1:-http://localhost:3000}"
HEALTH_ENDPOINT="${APP_URL%/}/api/context7/health"

echo "Checking Context7 health at ${HEALTH_ENDPOINT}"
response="$(curl -sS "${HEALTH_ENDPOINT}")"
status="$(echo "$response" | jq -r '.status // "unknown"')"
success="$(echo "$response" | jq -r '.success')"

echo "Response: $response"

if [[ "$success" != "true" ]]; then
  echo "Context7 health check failed (status: $status)"
  exit 1
fi

echo "Context7 health check OK (status: $status)"


