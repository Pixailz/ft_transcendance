import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

function addPrefixToSwaggerPaths(document, prefix: string) {
    const paths = Object.keys(document.paths);
    paths.forEach((path) => {
        const pathToChange = document.paths[path];
        delete document.paths[path];
        document.paths[`${prefix}${path}`] = pathToChange;
    });
}

function configureSwagger(app) {
    const config = new DocumentBuilder()
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        })
        .addSecurityRequirements("bearer")
        .setTitle("Pong API")
        .setDescription("The Pong API")
        .setVersion("0.6.9.420")
        .build();


    const document = SwaggerModule.createDocument(app, config);
    addPrefixToSwaggerPaths(document, "/api");

    SwaggerModule.setup("man", app, document, {
        customSiteTitle: "Pong API",
        customCssUrl: "/assets/css/swagger-dark.css",
        swaggerOptions: {
            showRequestDuration: true
        },
        explorer: false
    });
}

export default configureSwagger;