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
  const [displayCurPrice, setDisplayCurPrice] = useState<boolean>(false);
  const [displayWrongGuessMarker, setDisplayWrongGuessMarker] =
    useState<boolean>(false);

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
      correctGuess(); // Peaks olema correctguess
    } else {
      wrongGuess();
    }
  };

  const handleLowerGuess = () => {
    if (curProduct && prevProduct && curProduct?.price < prevProduct?.price) {
      correctGuess(); // Peaks olema wrongGuess
    } else {
      wrongGuess();
    }
  };

  

  const correctGuess = async () => {
    setScore(score + 1);
    setDisplayCurPrice(true);
    setTimeout(() => {
      setMoveToRightSide(true);
      setTimeout(() => {
        handleTestClick();
        setMoveToRightSide(false);
        setDisplayCurPrice(false);
      }, 350);
    }, 500);
  };

  const wrongGuess = () => {
    setDisplayWrongGuessMarker(true);
    setDisplayCurPrice(true);
  };

  return (
    <main className="z-0">
      <div className="w-full h-full absolute flex justify-around z-[-1]">
        <div className="m-auto w-1 h-2/3 bg-black flex flex-col justify-around">
          {" "}
          <div
            className={classNames(
              " w-20 h-20 bg-red-600 right-[calc(3.5rem-1.125rem)] relative rounded-full flex flex-col scale-0 duration-300",
              { "scale-100": displayWrongGuessMarker }
            )} 
          >
            <img src="./pictures/rist.png" alt="" />
          
          </div>
        </div>
      </div>
      {curProduct ? (
        <>
          <div className="w-full h-screen flex justify-evenly bg-transparent">
            <div className="flex flex-col items-center justify-center w-1/2 h-screen  text-center bg-transparent pt-12">
              {moveToRightSide ? (
                <></>
              ) : (
                <>
                  <img className="h-60" src={prevProduct?.imageLink} alt="" />

                  <div className="h-48">
                    <p className="font-bold text-xl">
                      {prevProduct?.name ?? ""}
                    </p>
                    <p>{prevProduct?.chain}</p>
                    <div className="h-40">
                      <p className="font-bold text-xl mt-2">
                        {prevProduct?.price.toFixed(2)}€
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div
              className={classNames(
                "flex flex-col items-center justify-center w-1/2 h-screen  text-center pt-12",
                {
                  "-translate-x-full transition": moveToRightSide,
                }
              )}
            >
              <img className="h-60" src={curProduct.imageLink} alt="" />

              <div className="h-48">
                <p className="test font-bold text-xl">{curProduct.name}</p>
                <p>{curProduct.chain}</p>
                <div className="h-40">
                  {displayCurPrice ? (
                    <>
                      {" "}
                      <p className="font-bold text-xl mt-2">
                        {curProduct?.price.toFixed(2)}€
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 mt-1">MAKSAB</p>
                      <button
                        className="py-2 px-4 bg-green-500 text-white font-bold h-10 rounded-full hover:bg-green-700 border-b-4 border-green-700"
                        onClick={handleHigherGuess}
                      >
                        ROHKEM
                      </button>
                      <button
                        className=" py-2 px-4 m-1 bg-red-500 text-white font-bold h-10 rounded-full hover:bg-red-700 border-b-4 border-red-700"
                        onClick={handleLowerGuess}
                      >
                        VÄHEM
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            {displayWrongGuessMarker ?
                
                <div onClick={()=>{window.location.reload()}} className="flex absolute bottom-8 hover:cursor-pointer border py-2 px-4 m-1 bg-red-500 text-white font-bold h-10 rounded-full hover:bg-red-700 border-b-4 border-red-700" >
                  proovi uuesti
                </div>
                :
                <></>
              }
          </div>
          
        </>
      ) : (
        <></>
      )}
      <h1 className={classNames("absolute top-5 right-10 font-bold text-xl", {"animate-bounce text-2xl":displayWrongGuessMarker})}>
        Skoor: {score}
      </h1>
      <img className="w-0" src={backupProduct?.imageLink} alt="" />

      
    </main>
  );
}
