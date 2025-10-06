export default function AiTaxonomy() {
  return (
    <>
      <ul>
        <li>
          Artificial Intelligence (AI)
          <ul>
            <li>
              Machine Learning (ML)
              <ul>
                <li>
                  Neural Networks
                  <ul>
                    <li>
                      Deep Learning
                      <ul>
                        <li>
                          <strong>Feedforward Neural Networks</strong>{" "}
                          (Multilayer Perceptron, Fully Connected Neural
                          Network)
                        </li>
                        <li>Convolutional Neural Networks (CNN)</li>
                        <li>Recurrent Neural Networks (RNN/LSTM/GRU)</li>
                        <li>Transformers</li>
                        <li>Diffusion Models</li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  Reinforcement Learning
                  <ul>
                    <li>Value-based methods (e.g., Q-learning, DQN)</li>
                    <li>
                      Policy-based / Actor–Critic methods (e.g., PPO, A3C/A2C,
                      SAC)
                    </li>
                    <li>
                      Deep RL: RL where policy/value/model are neural networks
                      (often CNNs/Transformers)
                    </li>
                  </ul>
                </li>
                <li>
                  Classical (non-deep) ML
                  <ul>
                    <li>Linear/Logistic Regression</li>
                    <li>Decision Trees / Random Forests</li>
                    <li>Support Vector Machines (SVM)</li>
                    <li>k-NN, k-Means, PCA</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Symbolic / Classical AI (non‑ML)
              <ul>
                <li>Search & Planning (A*, Minimax)</li>
                <li>Rule-Based Systems / Expert Systems</li>
                <li>Constraint Satisfaction / Logic Programming</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </>
  );
}
