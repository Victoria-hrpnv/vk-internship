class IntersectionObserver {
    constructor(callback) {
        this.callback = callback;
        this.elements = new Map();
    }

    observe(element) {
        this.elements.set(element, true);
    }

    unobserve(element) {
        this.elements.delete(element);
    }

    disconnect() {
        this.elements.clear();
    }


    trigger() {
        this.callback(this.elements.keys().map(element => ({
            target: element,
            isIntersecting: true,
        })));
    }
}


window.matchMedia = jest.fn().mockImplementation(() => {
    return {
        matches: false,
        // eslint-disable-next-line no-undef
        addListener: jest.fn(),
        // eslint-disable-next-line no-undef
        removeListener: jest.fn(),
    };
});

window.IntersectionObserver = IntersectionObserver;