import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { IoArrowBackSharp, IoArrowForwardSharp } from "react-icons/io5";

const reviews = [
  {
    id: 1,
    text: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine.",
    name: "Awlad Hossin",
    title: "Senior Product Designer",
  },
  {
    id: 2,
    text: "My back pain is almost gone. Posture Pro changed my daily comfort.",
    name: "Samantha Lee",
    title: "Fitness Coach",
  },
  {
    id: 3,
    text: "Superb product! Improved my sitting posture within a week.",
    name: "David Miller",
    title: "UX Engineer",
  },
  {
    id: 4,
    text: "Easy to wear and highly effective. Love how simple it is.",
    name: "Karen Brown",
    title: "Yoga Instructor",
  },
  {
    id: 5,
    text: "Highly recommend for office workers. Subtle and powerful!",
    name: "James Clark",
    title: "Marketing Lead",
  },
  {
    id: 6,
    text: "A must-have! I can feel my core getting stronger.",
    name: "Maria Garcia",
    title: "Health Blogger",
  },
  {
    id: 7,
    text: "I wear it daily. Keeps me upright and pain-free.",
    name: "Ali Khan",
    title: "Startup Founder",
  },
  {
    id: 8,
    text: "Never thought posture could impact my mood. Big win!",
    name: "Julia Adams",
    title: "Life Coach",
  },
  {
    id: 9,
    text: "Very helpful. Easy to adjust and wear for hours.",
    name: "Henry Watson",
    title: "Remote Developer",
  },
  {
    id: 10,
    text: "Posture Pro really works. It's now part of my daily routine.",
    name: "Emma Stone",
    title: "Wellness Expert",
  },
];

export default function CustomerReview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  return (
    <section className="px-4 md:px-0 py-12  bg-gray-100">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">
          What our customers are sayings
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>

      <div className="relative">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          slidesPerView={1}
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          pagination={{ clickable: true, el: ".custom-pagination" }}
          navigation={{
            prevEl: ".prev-btn",
            nextEl: ".next-btn",
          }}
          breakpoints={{
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 3 },
            1440: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Navigation, Autoplay]}
          className="pb-14"
        >
          {reviews.map((review, index) => {
            const isActive = index === activeIndex;

            return (
              <SwiperSlide key={review.id} className="flex justify-center py-7">
                <div
                  className={`
                    w-full max-w-sm p-6 rounded-3xl transition-all duration-500 ease-in-out
                    ${
                      isActive
                        ? "bg-white scale-105  blur-0 opacity-100 z-10"
                        : "bg-white scale-95 blur-xs opacity-100"
                    }
                    flex flex-col justify-between min-h-[260px]
                  `}
                >
                  <div>
                    <div className="text-4xl text-cyan-400 mb-3">“</div>
                    <p className="text-gray-700 mb-5">{review.text}</p>
                  </div>
                  <div>
                    <hr className="mb-4 border-dashed" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-900 rounded-full" />
                      <div>
                        <p className="font-semibold text-sm">{review.name}</p>
                        <p className="text-xs text-gray-500">{review.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Pagination & Arrows */}
        <div className="flex md:max-w-fit w-auto   mx-auto justify-center items-center gap-4 mt-6">
          <button className="prev-btn w-fit p-2 md:p-0 md:w-14 md:h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:bg-gray-200">
            <IoArrowBackSharp />
          </button>
          <div className="custom-pagination flex md:gap-2 gap-1 min-w-fit"></div>
          <button className="next-btn w-fit p-2 md:p-0 md:w-14 md:h-10 rounded-full bg-lime-400 shadow flex items-center justify-center text-white hover:bg-lime-500">
            <IoArrowForwardSharp />
          </button>
        </div>
      </div>
    </section>
  );
}