export const doctorWelcomeTemplate = (
    name: string,
    email: string,
    password: string
) => {
    return {
        body: {
            name,
            intro: "Your doctor account has been created successfully",
            table: {
                data: [
                    {
                        Email: email,
                        "Temporary Password": password,
                    },
                ],
            },
            outro: "Please login and change your password immediately",
        },
    };

};