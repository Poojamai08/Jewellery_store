function About() {
    return (
        <main className="bg-[#f8f6f1] text-[#171717]">

            {/* HERO */}
            <section className="flex min-h-[55vh] items-center justify-center px-6 py-24 text-center">
                <div className="max-w-3xl">

                    <p className="text-[9px] uppercase tracking-[0.4em] text-[#a9874a]">
                        The AURELIA Story
                    </p>

                    <h1 className="mt-6 font-serif text-5xl leading-tight sm:text-6xl">
                        Jewellery with a story.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-black/55">
                        At AURELIA, we believe jewellery is more than an
                        accessory. It is a reflection of who you are,
                        the moments you cherish, and the memories you
                        carry with you.
                    </p>

                </div>
            </section>


            {/* OUR STORY */}
            <section className="border-t border-black/10 bg-white px-6 py-20 sm:px-8 lg:py-28">

                <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-2 lg:items-center">

                    <div>
                        <p className="text-[9px] uppercase tracking-[0.35em] text-[#a9874a]">
                            Our Story
                        </p>

                        <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
                            Made for moments that matter.
                        </h2>
                    </div>

                    <div className="space-y-5 text-sm leading-7 text-black/55">
                        <p>
                            AURELIA was created with a simple vision:
                            to bring timeless jewellery into everyday
                            moments.
                        </p>

                        <p>
                            From delicate everyday pieces to statement
                            designs for celebrations, every collection
                            is thoughtfully created to complement the
                            woman who wears it.
                        </p>

                        <p>
                            We believe true elegance does not need to
                            be loud. It lives in the details, the
                            craftsmanship and the feeling a beautiful
                            piece brings.
                        </p>
                    </div>

                </div>

            </section>


            {/* PHILOSOPHY */}
            <section className="px-6 py-20 sm:px-8 lg:py-28">

                <div className="mx-auto max-w-[1200px] text-center">

                    <p className="text-[9px] uppercase tracking-[0.35em] text-[#a9874a]">
                        Our Philosophy
                    </p>

                    <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
                        Timeless. Elegant. Personal.
                    </h2>

                    <div className="mt-14 grid gap-10 md:grid-cols-3">

                        <div>
                            <h3 className="font-serif text-2xl">
                                Timeless Design
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-black/50">
                                Designs created to remain beautiful
                                through changing trends and seasons.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-serif text-2xl">
                                Thoughtful Craft
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-black/50">
                                Every detail is considered to create
                                jewellery that feels special.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-serif text-2xl">
                                Made for You
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-black/50">
                                Pieces designed to become part of your
                                own story and everyday memories.
                            </p>
                        </div>

                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="bg-[#111111] px-6 py-20 text-center text-white sm:px-8 lg:py-24">

                <p className="text-[9px] uppercase tracking-[0.35em] text-[#c6a15b]">
                    Discover AURELIA
                </p>

                <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
                    Find something made for your story.
                </h2>

                <a
                    href="/shop"
                    className="mt-8 inline-block border border-[#c6a15b] px-8 py-4 text-[9px] uppercase tracking-[0.25em] text-[#c6a15b] transition hover:bg-[#c6a15b] hover:text-white"
                >
                    Explore Collection
                </a>

            </section>

        </main>
    );
}

export default About;