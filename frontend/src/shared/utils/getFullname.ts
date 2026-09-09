interface HasNameFields {
  firstName: string;
  lastName: string;
  email: string;
}

export function fullName(u: HasNameFields): string {
  return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email;
}
