import { styles } from "@/app/styles/style";
import Image from "next/image";
import ReviewCard from "../Review/ReviewCard";

type Props = {};
const Reviews = (props: Props) => {
  const reviews = [
    {
      name: "Gene Bates",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      profession: "Student | Cambridge university",
      comment:
        "Lorem  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto vero dignissimos voluptate debitis, nam sed non, eum neque cupiditate quisquam labore sit! Harum quam, numquam quae quia laudantium tenetur minus. ipumsdfdfd a asffef  asfsafgr   afafefa asfafw asfgrwegwe afasfeqfqf",
    },
    {
      name: "Verna Santos",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profession: "Fullstack developer",
      comment:
        "Lorem Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto vero dignissimos voluptate debitis, nam sed non, eum neque cupiditate quisquam labore sit! Harum quam, numquam quae quia laudantium tenetur minus. ipumsdfdfd a asffef  asfsafgr   afafefa asfafw asfgrwegwe afasfeqfqf",
    },
    {
      name: "Jay Bates",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      profession: "Computer science engineering student",
      comment:
        "Lorem  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto vero dignissimos voluptate debitis, nam sed non, eum neque cupiditate quisquam labore sit! Harum quam, numquam quae quia laudantium tenetur minus. ipumsdfdfd a asffef  asfsafgr   afafefa asfafw asfgrwegwe afasfeqfqf",
    },
    {
      name: "Gibbas vda",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      profession: "Student | Cambridge university",
      comment:
        "Lorem ipumsdfdfd a asffef  asfsafgr   afafefa asfafw asfgrwegwe afasfeqfqf  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto vero dignissimos voluptate debitis, nam sed non, eum neque cupiditate quisquam labore sit! Harum quam, numquam quae quia laudantium tenetur minus.",
    },
    {
      name: "Mima Davidson",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      profession: "Student | Cambridge university",
      comment:
        "Lorem  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto vero dignissimos voluptate debitis, nam sed non, eum neque cupiditate quisquam labore sit! Harum quam, numquam quae quia laudantium tenetur minus. ipumsdfdfd a asffef  asfsafgr   afafefa asfafw asfgrwegwe afasfeqfqf",
    },
    {
      name: "Gene Bates",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      profession: "Student | Cambridge university",
      comment:
        "Lorem  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto vero dignissimos voluptate debitis, nam sed non, eum neque cupiditate quisquam labore sit! Harum quam, numquam quae quia laudantium tenetur minus. ipumsdfdfd a asffef  asfsafgr   afafefa asfafw asfgrwegwe afasfeqfqf",
    },
    {
      name: "Gene Bates",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      profession: "Student | Cambridge university",
      comment:
        "Lorem  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto vero dignissimos voluptate debitis, nam sed non, eum neque cupiditate quisquam labore sit! Harum quam, numquam quae quia laudantium tenetur minus. ipumsdfdfd a asffef  asfsafgr   afafefa asfafw asfgrwegwe afasfeqfqf",
    },
    {
      name: "Luara Dev",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
      profession: "Student | Cambridge university",
      comment:
        "Lorem  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto vero dignissimos voluptate debitis, nam sed non, eum neque cupiditate quisquam labore sit! Harum quam, numquam quae quia laudantium tenetur minus. ipumsdfdfd a asffef  asfsafgr   afafefa asfafw asfgrwegwe afasfeqfqf",
    },
    {
      name: "Gene Bates",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      profession: "Student | Cambridge university",
      comment:
        "Lorem Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto vero dignissimos voluptate debitis, nam sed non, eum neque cupiditate quisquam labore sit! Harum quam, numquam quae quia laudantium tenetur minus. ipumsdfdfd a asffef  asfsafgr   afafefa asfafw asfgrwegwe afasfeqfqf",
    },
  ];

  return (
    <div className='w-[90%] 800px:w-[85%] m-auto'>
      <div className='w-full 800px:flex items-center'>
        <div className='800px:w-[50%] w-full'>
          <Image
            src={require("../../../public/assets/businessImg.png")}
            width={700}
            height={700}
            alt=''
          />
        </div>
        <div className='800px:w-[50%] w-full'>
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Our Student Are <span className='text-blue-600'>Our Strength</span>
            <br />
            See What They Say About Us
          </h3>
          <br />
          <p className={styles.label}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus
            neque fuga sint perferendis ad dignissimos. Voluptatem, animi omnis,
            quibusdam beatae facilis doloremque explicabo nostrum quam dolore
            facere exercitationem quo amet repellendus. Omnis delectus corrupti
            reiciendis consectetur sit ipsa. Earum, voluptate.
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className='grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2xl:gap-[35px] mb-12 border-0'>
        {reviews &&
          reviews.map((i, index) => (
            <ReviewCard
              item={i}
              key={index}
            />
          ))}
      </div>
    </div>
  );
};
export default Reviews;
