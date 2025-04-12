"use client";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Import Swiper styles
import "swiper/css";

import { testimonials } from "@/data/testimonials";

export const TestimonialSection = () => {
  return (
    <section className="bg-yellow-100 px-6 py-24 text-center">
      <h3 className="mb-12 text-4xl font-bold text-blue-700">
        What Our Users Say
      </h3>

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="mx-auto h-40 max-w-3xl md:h-32"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <blockquote className="text-xl text-gray-700 italic">
              "{testimonial.quote}"
            </blockquote>
            <p className="mt-4 text-gray-500">
              — {testimonial.name}, {testimonial.position}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
