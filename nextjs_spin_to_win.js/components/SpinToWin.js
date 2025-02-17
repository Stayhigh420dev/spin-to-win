import React, { useState } from "react";
import { ethers } from "ethers";

const SpinToWin = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [tokenAddress, setTokenAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [isFreeSpin, setIsFreeSpin] = useState(true);
    const spinToWinAddress = "0x5C15b900dbfBb63d1dd032a86A0336bA3769ca6c";
    const spinToWinABI = [
        "function addPrize(bool isFreeSpin, address token, uint256 amount) external",
        "function freeSpin() external",
        "function paidSpin() external payable"
    ];

    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(spinToWinAddress, spinToWinABI, signer);
            setProvider(provider);
            setSigner(signer);
            setContract(contract);
        } else {
            alert("MetaMask not detected!");
        }
    };

    const addPrize = async () => {
        if (!contract) return alert("Connect wallet first");
        try {
            const tx = await contract.addPrize(isFreeSpin, tokenAddress, ethers.parseUnits(amount, 18));
            await tx.wait();
            alert("Prize added successfully!");
        } catch (error) {
            console.error(error);
            alert("Transaction failed");
        }
    };

    const freeSpin = async () => {
        if (!contract) return alert("Connect wallet first");
        try {
            const tx = await contract.freeSpin();
            await tx.wait();
            alert("You spun the wheel!");
        } catch (error) {
            console.error(error);
            alert("Transaction failed");
        }
    };

    const paidSpin = async () => {
        if (!contract) return alert("Connect wallet first");
        try {
            const tx = await contract.paidSpin({ value: ethers.parseEther("0.01") });
            await tx.wait();
            alert("You spun the wheel with BNB!");
        } catch (error) {
            console.error(error);
            alert("Transaction failed");
        }
    };

    return (
        <div className="flex flex-col items-center p-5">
            <button onClick={connectWallet} className="bg-blue-500 text-white px-4 py-2 rounded">Connect Wallet</button>
            <div className="p-5 mt-5 bg-gray-100 rounded shadow">
                <h2 className="text-lg font-bold">Add Prize</h2>
                <input type="text" placeholder="Token Address" value={tokenAddress} onChange={e => setTokenAddress(e.target.value)} className="border p-2 w-full" />
                <input type="text" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="border p-2 w-full mt-2" />
                <button onClick={addPrize} className="bg-green-500 text-white px-4 py-2 rounded mt-2">Add Prize</button>
            </div>
            <button onClick={freeSpin} className="bg-purple-500 text-white px-4 py-2 rounded mt-3">Free Spin</button>
            <button onClick={paidSpin} className="bg-orange-500 text-white px-4 py-2 rounded mt-3">Paid Spin (BNB)</button>
        </div>
    );
};

export default SpinToWin;
