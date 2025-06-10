build:
	@bun build src/index.ts --outfile create-foundry-app --compile
	@sudo mv create-foundry-app /usr/local/bin/