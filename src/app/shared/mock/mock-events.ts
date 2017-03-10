import { Event } from '../event.model';
import { Service } from '../service.model';
import { ServiceTag } from '../service-tag.model';

const SERVICE_TAGS: ServiceTag[] = [
    {id: 1, name: "Service Tag 1"},
    {id: 2, name: "Service Tag 2"},
    {id: 3, name: "Service Tag 3"},
];

const SERVICES: Service[] = [
    {id: 1, name: "Service 1", cost: 100, serviceTags: SERVICE_TAGS},
    {id: 2, name: "Service 2", cost: 100, serviceTags: SERVICE_TAGS},
    {id: 3, name: "Service 3", cost: 100, serviceTags: SERVICE_TAGS},
];

export const EVENTS: Event[] = [
    {
        id: 1,
        name: "Event 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate eget dui vitae eleifend. Vestibulum ac fringilla nunc. Nunc mattis elementum quam non vestibulum.",
        date: "Tomorrow",
        services: SERVICES
    },
    {
        id: 2,
        name: "Event 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate eget dui vitae eleifend. Vestibulum ac fringilla nunc. Nunc mattis elementum quam non vestibulum.",
        date: "Tomorrow",
        services: SERVICES
    },
    {
        id: 3,
        name: "Event 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate eget dui vitae eleifend. Vestibulum ac fringilla nunc. Nunc mattis elementum quam non vestibulum.",
        date: "Tomorrow",
        services: SERVICES
    },
    {
        id: 4,
        name: "Event 4", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate eget dui vitae eleifend. Vestibulum ac fringilla nunc. Nunc mattis elementum quam non vestibulum.",
        date: "At a later date",
        services: SERVICES
    },
    {
        id: 5,
        name: "Event 5", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate eget dui vitae eleifend. Vestibulum ac fringilla nunc. Nunc mattis elementum quam non vestibulum.",
        date: "At a later date",
        services: SERVICES
    },
    {
        id: 6,
        name: "Event 6", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate eget dui vitae eleifend. Vestibulum ac fringilla nunc. Nunc mattis elementum quam non vestibulum.",
        date: "At a later date",
        services: SERVICES
    },
    {
        id: 7,
        name: "Event 7", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate eget dui vitae eleifend. Vestibulum ac fringilla nunc. Nunc mattis elementum quam non vestibulum.",
        date: "At a later date",
        services: SERVICES
    },
    {
        id: 8,
        name: "Event 8", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate eget dui vitae eleifend. Vestibulum ac fringilla nunc. Nunc mattis elementum quam non vestibulum.",
        date: "At a later date",
        services: SERVICES
    }
];
