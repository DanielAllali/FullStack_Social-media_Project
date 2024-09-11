const initialData = {
    users: [
        {
            username: "adminUser123",
            name: {
                firstName: "Admin",
                lastName: "User",
            },
            bio: "Admin user bio",
            email: "admin@example.com",
            phone: "123-456-7890",
            password: "AdminPass123",
            image: {
                src: "https://picsum.photos/200/300",
                alt: "profile picture",
            },
            sandbox: [],
            isAdmin: true,
        },
        {
            username: "regularUser456",
            name: {
                firstName: "Regular",
                lastName: "User",
            },
            bio: "Regular user bio",
            email: "regular@example.com",
            phone: "987-654-3210",
            password: "RegularPass123",
            image: {
                src: "https://picsum.photos/200/300",
                alt: "profile picture",
            },
            sandbox: [],
            isAdmin: false,
        },
    ],
};
export default initialData;
