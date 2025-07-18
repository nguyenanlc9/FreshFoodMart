export interface FruitGift {
  id: number;
  image: string;
  description: string;
}

const sampleGifts: FruitGift[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1606813903149-10405f9b55a4?auto=format&fit=crop&w=400&h=300",
    description: "Combo trái cây tươi cho gia đình",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=400&h=300",
    description: "Hộp quà vitamin C tăng sức đề kháng",
  },
];

interface Props {
  gifts?: FruitGift[];
}

export default function FruitGiftSection({ gifts = sampleGifts }: Props) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">🍊 Quà tặng trái cây</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className="bg-white rounded-xl shadow overflow-hidden flex flex-col md:flex-row card-hover"
            >
              <img
                src={gift.image}
                alt={gift.description}
                className="h-48 md:h-auto md:w-1/3 object-cover"
              />
              <div className="p-4 flex-1 flex items-center">
                <p className="text-gray-700">{gift.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
