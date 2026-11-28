// CV requests: visitors leave their details on /cv/, and the Worker emails
// them to Ahmed, who replies with the CV himself.

/** Sender of the notification. Its domain must be onboarded to Cloudflare Email Sending. */
export const CV_REQUEST_FROM = { name: "dakhakhny.com", email: "cv-request@dakhakhny.com" };

/** Longest accepted value per field. The form uses the same numbers as `maxlength`. */
export const CV_REQUEST_LIMITS = {
	name: 100,
	email: 254,
	company: 100,
	linkedin: 200,
	message: 1000,
} as const;

/** Hidden field that people never see. Bots that fill every field fill it too. */
export const HONEYPOT_FIELD = "website";

export interface CvRequest {
	name: string;
	email: string;
	company: string;
	linkedin: string;
	message: string;
}

export type ParseResult =
	| { kind: "ok"; request: CvRequest }
	| { kind: "invalid" }
	| { kind: "bot" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** One line of text: no control characters or line breaks, single spaces. */
function oneLine(value: FormDataEntryValue | null): string {
	if (typeof value !== "string") return "";
	return value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
}

/** Multi-line text: keeps line breaks, drops other control characters. */
function multiLine(value: FormDataEntryValue | null): string {
	if (typeof value !== "string") return "";
	return value
		.replace(/\r\n?/g, "\n")
		.replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, " ")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

export function parseCvRequest(form: FormData): ParseResult {
	if (oneLine(form.get(HONEYPOT_FIELD)) !== "") return { kind: "bot" };

	const request: CvRequest = {
		name: oneLine(form.get("name")),
		email: oneLine(form.get("email")),
		company: oneLine(form.get("company")),
		linkedin: oneLine(form.get("linkedin")),
		message: multiLine(form.get("message")),
	};

	const tooLong = (Object.keys(CV_REQUEST_LIMITS) as (keyof CvRequest)[]).some(
		(field) => request[field].length > CV_REQUEST_LIMITS[field],
	);
	if (tooLong || request.name === "" || !EMAIL_PATTERN.test(request.email)) {
		return { kind: "invalid" };
	}
	return { kind: "ok", request };
}

/** The notification Ahmed receives. Replying to it answers the requester. */
export function composeCvRequestEmail(
	request: CvRequest,
	options: { to: string; country?: string; receivedAt?: Date },
) {
	const receivedAt = (options.receivedAt ?? new Date()).toISOString();
	const subject = `CV request from ${request.name}${request.company ? ` (${request.company})` : ""}`;
	const lines = [
		"New CV request from dakhakhny.com",
		"",
		`Name:     ${request.name}`,
		`Email:    ${request.email}`,
		`Company:  ${request.company || "-"}`,
		`LinkedIn: ${request.linkedin || "-"}`,
		`Country:  ${options.country || "unknown"} (from Cloudflare)`,
		`Received: ${receivedAt}`,
		"",
		"Message:",
		request.message || "-",
		"",
		`Reply to this email to answer ${request.email} directly.`,
	];
	return {
		from: CV_REQUEST_FROM,
		to: options.to,
		replyTo: { name: request.name, email: request.email },
		subject,
		text: lines.join("\n"),
	};
}
