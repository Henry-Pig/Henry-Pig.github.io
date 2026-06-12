export function isAdminRequest(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  return Boolean(token && request.headers.get("x-admin-token") === token);
}

export function adminUnauthorizedResponse() {
  return { success: false, data: null, error: "Unauthorized. Please check ADMIN_TOKEN." };
}
