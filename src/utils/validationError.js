export class ValidationError extends Error {
    constructor(message, details) {
        super(message);
        this.details = details.map(err => ({
            path: err.path,
            message: err.message
        }))
        this.status = 400;
    }
}