import { NextResponse } from "next/server";
import {
  researchAgent,
  writerAgent,
  seoAgent,
  reviewAgent,
  socialAgent,
} from "../../../lib/agents";

export async function POST(req) {
  try {
    const { topic } = await req.json();

    const research = await researchAgent(topic);
    const blog = await writerAgent(research);
    const seo = await seoAgent(blog);
    const finalBlog = await reviewAgent(seo);
    const social = await socialAgent(finalBlog);

    return NextResponse.json({ blog: finalBlog, social });

  } catch (error) {
    console.error("ROUTE ERROR:", error);

    return NextResponse.json({
      error: "Backend failed",
    });
  }
}