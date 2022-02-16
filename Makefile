RM:=rm -rvf

all: run

r run: package-lock.json
	$(info Ejecutando app..)
	@npx $(MODULE_BUNDLER) --serve --port $(PORT) --input=$(SOURCE_PATH) --output=$(TARGET_PATH)

c clean:
	$(info Borrando archivos innecesarios..)
	-@$(RM) {node_modules,.log,package-lock.json}
	-@$(RM) {public,dist}

package-lock.json: package.json
	@npm install

.PHONY: r run b build c clean all

-include .env
