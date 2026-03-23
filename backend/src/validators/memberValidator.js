const { z } = require("zod");

const inviteMemberSchema = z.object({
	email: z.string().email(),
	role: z.enum(["admin", "editor", "viewer"]),
});

const updateMemberRoleSchema = z.object({
	role: z.enum(["admin", "editor", "viewer"]),
});

module.exports = {
	inviteMemberSchema,
	updateMemberRoleSchema,
};
