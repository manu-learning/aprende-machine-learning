RM:=rm -rvf

SOURCE_PATH=src/index.html
TARGET_PATH=--dist-dir public
MODULE_BUNDLER_VERSION=2.3.1
MODULE_BUNDLER=parcel@$(MODULE_BUNDLER_VERSION)

r run: package-lock.json
	$(info Ejecutando app..)
	@npx $(MODULE_BUNDLER) $(SOURCE_PATH) $(TARGET_PATH)

b build: package-lock.json
	$(info Construyendo app..)
	@npx $(MODULE_BUNDLER) build

c clean:
	$(info Borrando archivos innecesarios..)
	-@$(RM) {node_modules,.log,package-lock.json}
	-@$(RM) {.parcel-cache,public,dist}

package-lock.json: package.json
	@npm install

.PHONY: r run b build c clean
