#!/bin/bash
# Script wrapper para executar scripts Node com variáveis de ambiente

cd "$(dirname "$0")/.."

# Carregar variáveis de .env.local
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | grep -v '^$' | xargs)
fi

# Executar o comando passado
exec "$@"


