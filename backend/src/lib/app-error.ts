interface ErrorPayload extends Record<string, unknown> {
	code?: string;
	message?: string;
	namespace?: string;
}

export class AppError extends Error {
	status: number;
	payload?: ErrorPayload;

	constructor(status: number, message?: string, payload?: ErrorPayload) {
		super(message);
		this.status = status;
		this.payload = payload;
		// Ensure the name of this error is the same as the class name
		this.name = this.constructor.name;
		// This clips the constructor invocation from the stack trace.
		// It's not absolutely essential, but it does make the stack trace a little nicer.
		//  @see Node.js reference (bottom)
		Error.captureStackTrace(this, this.constructor);
	}
}
