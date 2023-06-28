import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";

import { ProductService } from "./product.service";

@Controller("prod")
export class ProductController {
	constructor(private productService: ProductService) {}

	@Post("add")
	addProduct(
		@Body("title") prodTitle: string,
		@Body("description") prodDesc: string,
		@Body("price") prodPrice: number,
	) {
		const generatedId = this.productService.insertProduct(
			prodTitle,
			prodDesc,
			prodPrice,
		);
		console.log("id          ", generatedId);
		console.log("title       ", prodTitle);
		console.log("description ", prodDesc);
		console.log("price       ", prodPrice);
		console.log();
		return { id: generatedId };
	}

	@Get("get")
	getAllProduct() {
		return this.productService.getProducts();
	}

	@Get("get/:id")
	getProduct(@Param("id") prodId: string) {
		return this.productService.getSingleProduct(prodId);
	}

	@Patch("patch/:id")
	updateProduct(
		@Param("id") prodId: string,
		@Body("title") prodTitle: string,
		@Body("description") prodDesc: string,
		@Body("price") prodPrice: number,
	) {
		this.productService.updateProduct(
			prodId,
			prodTitle,
			prodDesc,
			prodPrice,
		);
		return null;
	}

	@Delete("delete/:id")
	removeProduct(@Param("id") prodId: string) {
		this.productService.deleteProduct(prodId);
		return null;
	}
}
