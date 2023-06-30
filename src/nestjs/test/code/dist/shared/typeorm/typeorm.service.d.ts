import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare class TypeOrmConfigService implements TypeOrmOptionsFactory {
    private readonly config;
    createTypeOrmOptions(): TypeOrmModuleOptions;
}
