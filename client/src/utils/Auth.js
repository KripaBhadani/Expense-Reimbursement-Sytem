export const checkRoleAccess = (userRole, allowedRoles) => {
    // console.log(`User Role: ${userRole} Allowed Roles: ${JSON.stringify(allowedRoles)}`);
    return allowedRoles.includes(userRole);
};
