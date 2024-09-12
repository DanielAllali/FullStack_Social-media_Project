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
    posts: [
        {
            title: "The Journey Begins",
            subtitle: "Setting off on a new adventure",
            content:
                "This is the first post in a series documenting my journey.",
            image: {
                url: "https://example.com/image1.jpg",
                alt: "Journey start",
            },
            video: {
                src: "https://example.com/video1.mp4",
                alt: "Introductory video",
            },
            likes: [],
            messages: [],
            createdAt: new Date(),
        },
        {
            title: "Overcoming Challenges",
            subtitle: "Pushing through obstacles",
            content:
                "Today, I faced a major hurdle, but I learned valuable lessons.",
            image: {
                url: "https://example.com/image2.jpg",
                alt: "Facing challenges",
            },
            video: {
                src: "https://example.com/video2.mp4",
                alt: "Challenge video",
            },
            likes: [],
            messages: [],
            createdAt: new Date(),
        },
        {
            title: "A Glimpse of Success",
            subtitle: "Achieving milestones",
            content:
                "After much effort, I'm beginning to see the fruits of my labor.",
            image: {
                url: "https://example.com/image3.jpg",
                alt: "Success",
            },
            video: {
                src: "https://example.com/video3.mp4",
                alt: "Milestone video",
            },
            likes: [],
            messages: [],
            createdAt: new Date(),
        },
    ],
    messages: [
        {
            deleted: false,
            content: "Great post! I learned a lot from this.",
            likes: [],
        },
        {
            deleted: false,
            content: "I totally agree with your perspective.",
            likes: [],
        },
        {
            deleted: true,
            content: "This message has been deleted.",
            likes: [],
        },
    ],
};
export default initialData;
