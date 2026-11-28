import type { APIRoute } from "astro";
import { composeCvRequestEmail, parseCvRequest } from "../../lib/cv-request";

// Runs in the Worker on each request; every other page is static.
export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	const form = await request.formData().catch(() => null);
	if (!form) return redirect("/cv/?error=invalid", 303);

	const parsed = parseCvRequest(form);
	// Bots get the normal thank-you page, so they learn nothing.
	if (parsed.kind === "bot") return redirect("/cv/sent/", 303);
	if (parsed.kind === "invalid") return redirect("/cv/?error=invalid", 303);

	const { env, cf } = locals.runtime;
	if (!env.CV_EMAIL || !env.CV_REQUEST_TO) {
		console.error("cv-request: the CV_EMAIL binding or the CV_REQUEST_TO secret is missing");
		return redirect("/cv/?error=send", 303);
	}

	try {
		await env.CV_EMAIL.send(
			composeCvRequestEmail(parsed.request, {
				to: env.CV_REQUEST_TO,
				country: typeof cf?.country === "string" ? cf.country : undefined,
			}),
		);
	} catch (error) {
		const { code, message } = (error ?? {}) as { code?: string; message?: string };
		console.error("cv-request: sending failed", code, message);
		return redirect("/cv/?error=send", 303);
	}
	return redirect("/cv/sent/", 303);
};
