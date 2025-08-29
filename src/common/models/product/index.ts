import { Category } from "../../enums/Category";
import { EntityStatus } from "../../enums/EntityStatus";
import { SubCategory } from "../../enums/SubCategory";
import { SizeResponse } from "../size";

export interface ProductRequest{
    id: number;
    name: string;
    price: number;
    bestSeller: boolean;
    description: string;
    status: EntityStatus
    image: string;
    category: Category;
    subCategory: SubCategory;
    sizes: SizeResponse[]
}

export interface ProductResponse{
    id: number;
    name: string;
    price: number;
    bestSeller: boolean;
    description: string;
    status: EntityStatus
    image: string;
    category: Category;
    subCategory: SubCategory;
    sizes: SizeResponse[]
}

export interface SearchProductRequest{
    name?: string;
    statuses?: EntityStatus[];
    categories?: Category[];
    subCategories?: SubCategory[];
}