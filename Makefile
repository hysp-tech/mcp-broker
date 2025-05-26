# Makefile for MCP Broker

install:
	npm run install-all

client-install:
	cd client && npm install

server-install:
	npm install

build:
	npm run build

start:
	npm start

develop:
	npm run dev

docker-build:
	docker build -t mcp-broker .

docker-up:
	docker-compose up --build

docker-down:
	docker-compose down

test:
	cd client && npm test

lint:
	echo "No lint command defined. Add your linter here."

.PHONY: install client-install server-install build start develop docker-build docker-up docker-down test lint 