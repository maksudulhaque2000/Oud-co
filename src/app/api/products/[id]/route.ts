import { NextResponse } from "next/server";
import { deleteProduct, getProduct, updateProduct, type ProductInput } from "@/lib/mongo-products";

function isString(value: unknown) {
  return typeof value === "string";
}

function isNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load product." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json().catch(() => null)) as Partial<ProductInput> | null;
    const price = body?.price;
    const imageUrl = body?.imageUrl;
    const rating = body?.rating;
    const volume = body?.volume;
    const origin = body?.origin;
    const longevity = body?.longevity;
    const notes = body?.notes;
    const createdAt = body?.createdAt;
    const updatedAt = body?.updatedAt;

    if (!body || !isString(body.title) || !isString(body.shortDescription) || !isString(body.fullDescription) || !isString(body.category) || !isNumber(price)) {
      return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
    }

    const validPrice: number = price as number;
    const validRating: number = isNumber(rating) ? (rating as number) : 4.5;

    const product = await updateProduct(id, {
      id,
      title: body.title,
      shortDescription: body.shortDescription,
      fullDescription: body.fullDescription,
      category: body.category as ProductInput["category"],
      price: validPrice,
      imageUrl: isString(imageUrl) ? imageUrl : "",
      rating: validRating,
      volume: isString(volume) ? volume : "10ml",
      origin: isString(origin) ? origin : "Bangladesh",
      longevity: isString(longevity) ? longevity : "8-10 hours",
      notes: isString(notes) ? notes : "Custom blend",
      createdAt: isString(createdAt) ? createdAt : undefined,
      updatedAt: isString(updatedAt) ? updatedAt : undefined,
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update product." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete product." },
      { status: 500 },
    );
  }
}
