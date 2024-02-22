"use client";
import classNames from "classnames";
import "./globals.css";
import { useState, useEffect } from "react";

export default function Home() {
  interface productInterface {
    name: string;
    chain: string;
    price: number;
    imageLink: string;
  }
  const [prevProduct, setPrevProduct] = useState<productInterface>();
  const [curProduct, setCurProduct] = useState<productInterface>();
  const [backupProduct, setBackupProduct] = useState<productInterface>();

  const [data, setData] = useState<string[][]>();
  const [chains, setChains] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [moveToRightSide, setMoveToRightSide] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/prices.csv");
        const text = await response.text();
        const rows = text.split("\n");
        setChains(rows[0].split(",").slice(1));
        setData(rows.slice(1).map((row) => row.replace("\r", "").split(",")));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setPrevProduct(getRandomProductWithPrice());
    setCurProduct(getRandomProductWithPrice());
    setBackupProduct(getRandomProductWithPrice());
  }, [data]);

  const getRandomProductWithPrice = (): productInterface => {
    if (!data) {
      console.error("no data loaded");
      return { name: "", chain: "", price: -1, imageLink: "" };
    }

    const productSelector = Math.floor(Math.random() * (data.length - 1));
    const chainSelector = Math.floor(Math.random() * chains.length);

    const product = data[productSelector][0];
    const chain = chains[chainSelector];
    const price = data[productSelector][chainSelector + 1];
    const replacePattern = new RegExp("[ õäöü%]", "g");
    const imageLink =
      "./pictures/" +
      product.toLowerCase().replaceAll(replacePattern, "") +
      ".png";

    if (price != "---") {
      return {
        name: product,
        chain: chain,
        price: parseFloat(price),
        imageLink: imageLink,
      };
    } else {
      return getRandomProductWithPrice();
    }
  };

  const handleTestClick = () => {
    setPrevProduct(curProduct);
    setCurProduct(backupProduct);
    setBackupProduct(getRandomProductWithPrice);
  };

  const handleHigherGuess = () => {
    if (curProduct && prevProduct && curProduct?.price > prevProduct?.price) {
      correctGuess();
    } else {
      wrongGuess();
    }
  };

  const handleLowerGuess = () => {
    if (curProduct && prevProduct && curProduct?.price < prevProduct?.price) {
      correctGuess();
    } else {
      correctGuess();
    }
  };

  const correctGuess = async () => {
    setScore(score + 1);
    setMoveToRightSide(true);
    setTimeout(() => {
      handleTestClick();
      setMoveToRightSide(false);
    }, 350);
  };

  const wrongGuess = () => {
    alert("Vale!");
    setScore(0);
    handleTestClick();
  };

  return (
    <main className="bg-gray-50">
      {curProduct ? (
        <>
          <div className="w-full h-screen flex justify-evenly">
            <div className="w-1/2 my-auto text-center border-r-4 border-black">
              {moveToRightSide ? (
                <></>
              ) : (
                <>
                  <img
                    className="mx-auto mb-5 h-60"
                    src={prevProduct?.imageLink}
                    alt=""
                  />
                  <p className="font-bold text-xl">
                    {prevProduct?.name ?? ""}
                  </p>
                  <p>{prevProduct?.chain}</p>
                  <p className="font-bold text-xl mt-7">
                    {prevProduct?.price}€
                  </p>
                  <div className="h-10 w-1"></div>
                </>
              )}
            </div>

            <div
              className={classNames("w-1/2 my-auto text-center", {
                "-translate-x-full transition": moveToRightSide,
              })}
            >
              <img
                className=" wiggle mb-5 mx-auto h-60"
                src={curProduct.imageLink}
                alt=""
              />
              <p className="test font-bold text-xl">{curProduct.name}</p>
              <p>{curProduct.chain}</p>
              <p className="mt-5 mb-3 text-gray-600">MAKSAB</p>
              <button
                className="bg-green-500 text-white font-bold h-10 py-2 px-4 rounded-full mx-2 hover:bg-green-700 border-b-4 border-green-700"
                onClick={handleHigherGuess}
              >
                ROHKEM
              </button>
              <button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-full mx-2 hover:bg-red-700 border-b-4 border-red-700"
                onClick={handleLowerGuess}
              >
                VÄHEM
              </button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <h1 className="absolute top-5 right-10 font-bold text-xl">
        Skoor: {score}
      </h1>
    </main>
  );
}
