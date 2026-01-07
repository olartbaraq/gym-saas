create_app:
	@nest generate app ${name}

folder:
	@nest generate module ${name}
	@nest generate controller ${name}
	@nest generate service ${name}

controller:
	@nest generate controller ${name}

service:
	@nest generate service ${name}

module:
	@nest generate module ${name}

resource:
	@nest generate resource ${name}

start:
	@yarn start:dev

generate_proto:
	@protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/${name}.proto
	
start_app:
	@yarn start:dev ${name}

# Check migration status
show:
	@yarn migration:show

# Revert if needed
revert:
	@yarn migration:revert

# Fix the migration file and run again
run:
	@yarn migration:run

build:
	@yarn build

lint:
	@yarn lint

format:
	@yarn format

test:
	@yarn test