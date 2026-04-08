-- Check all users and their roles
SELECT 
    u."Email",
    u."FirstName",
    u."LastName",
    r."Name" as "RoleName"
FROM users u
LEFT JOIN user_roles ur ON u."Id" = ur."UserId"
LEFT JOIN roles r ON ur."RoleId" = r."Id"
ORDER BY u."Email";
