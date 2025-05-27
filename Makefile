include makefiles/help.mk
# Makefile for MCP Broker

DOCKER_REGISTRY := hyperspacetech/mcp-broker
DOCKER_TAG := latest

install:  ## Install all dependencies
	npm run install-all

client-install:  ## Install client dependencies
	cd client && npm install

server-install:  ## Install server dependencies
	npm install

build:  ## Build the project
	npm run build

start:  ## Start the project
	npm start

develop:  ## Start the project in development mode	
	npm run dev

docker-build:  ## Build the project in a docker container
	docker build -t mcp-broker .

docker-push:  ## Push the project to a docker container
	docker tag mcp-broker:latest ${DOCKER_REGISTRY}:${DOCKER_TAG}
	docker push ${DOCKER_REGISTRY}:${DOCKER_TAG}

docker-up:  ## Start the project in a docker container
	docker-compose up --build

docker-down:  ## Stop the project in a docker container
	docker-compose down

test:  ## Run tests
	cd client && npm test

lint:  ## Run lint
	echo "No lint command defined. Add your linter here."

.PHONY: install client-install server-install build start develop docker-build docker-up docker-down test lint 