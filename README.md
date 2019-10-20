# VSCode extension for Spring Cloud Data Flow
This repository hosts modules to build extension for SCDF.

Current modules are:
- vscode-spring-cloud-dataflow
  - Actual vscode project resulting a real vsix extension file
- vscode-extension-core
  - Generic purpose library sharing common vscode extension features
- vscode-extension-di
  - Generic purpose library sharing common infersify based features to build extension atop of vscode-extension-core
- spring-cloud-dataflow-language-server
  - Actual language server based on a spring-dsl project.

See individual readme's in these project for futher info.

**NOTE**: As whis project is currently work-in-progress we're keeping all related projects under one repo.
          At some point in future all these will become a separate repos with individual lifecycle as idea
          is to have generic purpose core extension library(for those who don't want to marry with
          [inversify](http://inversify.io/), and DI library based on [inversify](http://inversify.io/)
          to easy extension development. SCDF Language Server inself will be a generic purpose implementation
          which can be used from any Language Client which chooce to do an integration into it.
