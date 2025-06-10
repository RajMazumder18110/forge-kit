build:
	@bun build src/index.ts --outfile forge-kit --compile
	@sudo mv forge-kit /usr/local/bin/