// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

contract VerifiableAnswer {

    struct Answer {
        string question;
        uint256 timestamp;
    }

    mapping(bytes32 => Answer) public answers;

    uint256 public submitCost = 0.0001 ether;

    address public immutable admin;

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Submit new answers (only admin) without collateral.
     * @param answerIds array of Answer IDs.
     * @param questions array of Original questions.
     */
    function submitAnswerAdmin(
        bytes32[] memory answerIds,
        string[] memory questions
    ) external {
        require(msg.sender == admin, "Unauthorized.");
        require(
            answerIds.length == questions.length, 
            "Array mismatch"
        );

        for (uint256 i=0; i<answerIds.length; i++) {
            answers[answerIds[i]] = Answer({
                question: questions[i],
                timestamp: block.timestamp
            });
        }
    }

    /**
     * @dev Submit new answer with collateral.
     * @param answerId Answer ID.
     * @param question Original question.
     */
    function submitAnswer(
        bytes32 answerId,
        string memory question
    ) external payable {
        require(answers[answerId].timestamp == 0, "Answer already set.");
        require(msg.value == submitCost, "Wrong cost.");

        answers[answerId] = Answer({
            question: question,
            timestamp: block.timestamp
        });
    }

    /**
     * @dev Withdraw collateral.
     */
    function withdrawAll() external {
        require(msg.sender == admin, "Unauthorized.");
        payable(admin).transfer(address(this).balance);
    }
}