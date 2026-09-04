/* =========================
   CANDIDATE DATA
========================= */

const candidates = {

    president: [
        {
            id: 1,
            name: "Juan Dela Cruz",
            party: "Student Unity Party",
            icon: "👨🏻"
        },
        {
            id: 2,
            name: "Maria Santos",
            party: "Progressive Students",
            icon: "👩🏻"
        },
        {
            id: 3,
            name: "Kevin Garcia",
            party: "Independent",
            icon: "👨🏽"
        }
    ],

    vicePresident: [
        {
            id: 1,
            name: "Anna Reyes",
            party: "Student Unity Party",
            icon: "👩🏻"
        },
        {
            id: 2,
            name: "Mark Tan",
            party: "Progressive Students",
            icon: "👨🏻"
        },
        {
            id: 3,
            name: "Sofia Cruz",
            party: "Independent",
            icon: "👩🏽"
        }
    ],

    secretary: [
        {
            id: 1,
            name: "James Lim",
            party: "Student Unity Party",
            icon: "👨🏻"
        },
        {
            id: 2,
            name: "Nicole Ramos",
            party: "Progressive Students",
            icon: "👩🏻"
        },
        {
            id: 3,
            name: "Paul Garcia",
            party: "Independent",
            icon: "👨🏽"
        }
    ]
};


/* =========================
   VOTE COUNTS
========================= */

const votes = {

    president: [0, 0, 0],

    vicePresident: [0, 0, 0],

    secretary: [0, 0, 0]
};


/* =========================
   SELECTED CANDIDATES
========================= */

const selected = {

    president: null,

    vicePresident: null,

    secretary: null
};


/* =========================
   START VOTING
========================= */

function startVoting() {

    document
        .getElementById("loginSection")
        .classList.remove("hidden");

    document
        .getElementById("loginSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================
   VERIFY STUDENT
========================= */

function verifyStudent() {

    const studentId =
        document
            .getElementById("studentId")
            .value
            .trim();

    const studentName =
        document
            .getElementById("studentName")
            .value
            .trim();

    const message =
        document.getElementById("loginMessage");


    if (studentId === "" || studentName === "") {

        message.textContent =
            "Please enter your Student ID and full name.";

        return;
    }


    if (studentId.length < 5) {

        message.textContent =
            "Please enter a valid Student ID.";

        return;
    }


    // Check if this browser has already voted

    if (
        localStorage.getItem("studentVoted")
        === "true"
    ) {

        message.textContent =
            "A vote has already been submitted from this browser.";

        return;
    }


    message.textContent = "";


    // Show voting section

    document
        .getElementById("loginSection")
        .classList.add("hidden");

    document
        .getElementById("voteSection")
        .classList.remove("hidden");


    // Generate candidates

    createCandidates(
        "president",
        "presidentCandidates"
    );

    createCandidates(
        "vicePresident",
        "vicePresidentCandidates"
    );

    createCandidates(
        "secretary",
        "secretaryCandidates"
    );


    document
        .getElementById("voteSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================
   CREATE CANDIDATE CARDS
========================= */

function createCandidates(position, elementId) {

    const container =
        document.getElementById(elementId);

    container.innerHTML = "";


    candidates[position].forEach(
        (candidate, index) => {

            const card =
                document.createElement("div");

            card.className = "candidate";


            card.innerHTML = `

                <div class="candidate-photo">
                    ${candidate.icon}
                </div>

                <h4>
                    ${candidate.name}
                </h4>

                <p>
                    ${candidate.party}
                </p>

                <input
                    type="radio"
                    name="${position}"
                    value="${index}"
                >

            `;


            card.addEventListener(
                "click",
                () => {

                    selectCandidate(
                        position,
                        index,
                        card
                    );

                }
            );


            container.appendChild(card);
        }
    );
}


/* =========================
   SELECT CANDIDATE
========================= */

function selectCandidate(
    position,
    index,
    card
) {

    selected[position] = index;


    // Remove selected state

    const cards =
        card.parentElement
            .querySelectorAll(".candidate");

    cards.forEach(item => {

        item.classList.remove("selected");

    });


    // Add selected state

    card.classList.add("selected");


    // Select radio

    const radio =
        card.querySelector("input");

    radio.checked = true;
}


/* =========================
   SUBMIT VOTE
========================= */

function submitVote() {

    const message =
        document.getElementById("voteMessage");


    // Make sure every position is selected

    if (
        selected.president === null ||
        selected.vicePresident === null ||
        selected.secretary === null
    ) {

        message.textContent =
            "Please select a candidate for every position.";

        return;
    }


    message.textContent = "";


    // Count votes

    votes.president[
        selected.president
    ]++;

    votes.vicePresident[
        selected.vicePresident
    ]++;

    votes.secretary[
        selected.secretary
    ]++;


    // Mark browser as voted

    localStorage.setItem(
        "studentVoted",
        "true"
    );


    // Hide voting page

    document
        .getElementById("voteSection")
        .classList.add("hidden");


    // Show confirmation

    document
        .getElementById("confirmationSection")
        .classList.remove("hidden");


    document
        .getElementById("confirmationSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================
   SHOW RESULTS
========================= */

function showResults() {

    const container =
        document.getElementById(
            "resultsContainer"
        );

    container.innerHTML = "";


    createResults(
        "President",
        "president",
        container
    );

    createResults(
        "Vice President",
        "vicePresident",
        container
    );

    createResults(
        "Secretary",
        "secretary",
        container
    );


    document
        .getElementById("confirmationSection")
        .classList.add("hidden");


    document
        .getElementById("results")
        .classList.remove("hidden");


    document
        .getElementById("results")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================
   CREATE RESULTS
========================= */

function createResults(
    title,
    position,
    container
) {

    const section =
        document.createElement("div");

    section.className =
        "result-position";


    const heading =
        document.createElement("h3");

    heading.textContent = title;


    section.appendChild(heading);


    const totalVotes =
        votes[position].reduce(
            (sum, value) => sum + value,
            0
        );


    candidates[position].forEach(
        (candidate, index) => {

            const voteCount =
                votes[position][index];


            let percentage = 0;


            if (totalVotes > 0) {

                percentage =
                    (voteCount / totalVotes) * 100;
            }


            const item =
                document.createElement("div");

            item.className = "result-item";


            item.innerHTML = `

                <div class="result-info">

                    <strong>
                        ${candidate.name}
                    </strong>

                    <span>
                        ${voteCount}
                        vote(s)
                        -
                        ${percentage.toFixed(1)}%
                    </span>

                </div>


                <div class="progress">

                    <div
                        class="progress-bar"
                        style="width: ${percentage}%"
                    >
                    </div>

                </div>

            `;


            section.appendChild(item);
        }
    );


    container.appendChild(section);
}