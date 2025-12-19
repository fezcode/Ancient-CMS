#!/bin/bash

MODE=$1

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}AncientCMS Dev Script${NC}"

# Stop Command
if [ "$MODE" == "stop" ]; then
    echo -e "${YELLOW}Stopping Docker Containers...${NC}"
    docker compose stop
    echo "Done."
    exit 0
fi

# Default to 'all' if no argument provided
if [ -z "$MODE" ]; then MODE="all"; fi

# Start Database (for 'all' or 'db')
if [ "$MODE" == "all" ] || [ "$MODE" == "db" ]; then
    echo -e "${GREEN}Starting Database (Docker)...${NC}"
    docker compose up -d
fi

# Function to handle Ctrl+C
cleanup() {
    echo -e "\n${YELLOW}Shutting down processes...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit
}

# Start Logic
if [ "$MODE" == "all" ]; then
    echo -e "${GREEN}Starting ALL services in parallel...${NC}"
    echo "Press Ctrl+C to stop all."
    
    # Trap Ctrl+C to run cleanup
    trap cleanup SIGINT

    (cd server && npm run dev) &
    (cd admin && npm run dev) &
    (cd website && npm run dev) &
    
    wait # Wait for all background processes
    
elif [ "$MODE" == "server" ]; then
    echo -e "${GREEN}Starting Server...${NC}"
    (cd server && npm run dev)
    
elif [ "$MODE" == "admin" ]; then
    echo -e "${GREEN}Starting Admin...${NC}"
    (cd admin && npm run dev)
    
elif [ "$MODE" == "website" ]; then
    echo -e "${GREEN}Starting Website...${NC}"
    (cd website && npm run dev)
fi
