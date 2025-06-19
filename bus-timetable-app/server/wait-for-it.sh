#!/bin/sh
#   Use this script to test if a given TCP host/port are available
#   Source: https://github.com/vishnubob/wait-for-it

set -e

TIMEOUT=15
QUIET=0
HOST=""
PORT=""
CMD=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--host)
            HOST="$2"
            shift 2
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        --) shift; CMD="$@"; break ;;
        *) break ;;
    esac
done

if [[ "$HOST" == "" || "$PORT" == "" ]]; then
    echo "Usage: $0 -h host -p port -- command args"
    exit 1
fi

for i in $(seq $TIMEOUT); do
    nc -z "$HOST" "$PORT" && break
    echo "Waiting for $HOST:$PORT... ($i/$TIMEOUT)"
    sleep 1
done

if ! nc -z "$HOST" "$PORT"; then
    echo "Timeout waiting for $HOST:$PORT"
    exit 1
fi

exec "$@" 