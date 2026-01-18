/*

Artificial Intelligence (AI)
├─ Machine Learning (ML)
│  ├─ Neural Networks & Deep Learning
│  │  ├─ Feedforward Neural Networks (MLP / Fully Connected)
│  │  ├─ Convolutional Neural Networks (CNNs)
│  │  ├─ Recurrent Neural Networks (RNNs / LSTM / GRU)
│  │  ├─ Generative Adversarial Networks (GANs)
│  │  ├─ Variational Autoencoders (VAEs)
│  │  ├─ Transformers
│  │  └─ Diffusion Models (U-Net + attention or Transformer based)
│  ├─ Reinforcement Learning (RL)
│  │  ├─ Value-based Methods (Discrete actions) (Q-Learning, DQN)
│  │  ├─ Policy-based Methods (Policy learning; continuous-friendly)
│  │  └─ Actor–Critic Methods (Policy + value; continuous-friendly) (A2C/A3C, PPO, SAC)
│  └─ Classical (Non-Deep) ML
│     ├─ Linear Regression
│     ├─ Logistic Regression
│     ├─ Decision Trees / Random Forests
│     ├─ Support Vector Machines (SVM)
│     ├─ k-Nearest Neighbors (k-NN)
│     ├─ k-Means Clustering
│     ├─ Principal Component Analysis (PCA)
│     └─ Hidden Markov Models (HMMs)
└─ Symbolic / Classical AI (Not Machine Learning)
   ├─ Search & Planning (A*, Minimax, Dijkstra, MCTS)
   ├─ Constraint Satisfaction / Logic Programming
   └─ Rule-Based / Expert Systems


*/
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
                  Neural Networks & Deep Learning
                  <ul>
                    <li>Feedforward Neural Networks (MLP / Fully Connected)</li>
                    <li>Convolutional Neural Networks (CNNs, U-Nets)</li>
                    <li>Recurrent Neural Networks (RNNs / LSTM / GRU)</li>
                    <li>Generative Adversarial Networks (GANs)</li>
                    <li>Variational Autoencoders (VAEs)</li>
                    <li>Transformers</li>
                    <li>
                      Diffusion Models (U-Net + attention or Transformer based)
                    </li>
                  </ul>
                </li>
                <li>
                  Reinforcement Learning (RL)
                  <ul>
                    <li>
                      Value-based Methods (Discrete actions) (Q-Learning, DQN)
                    </li>
                    <li>
                      Policy-based Methods (Policy learning; continuous-friendly)
                    </li>
                    <li>
                      Actor–Critic Methods (Policy + value; continuous-friendly)
                      (A2C/A3C, PPO, SAC)
                    </li>
                  </ul>
                </li>
                <li>
                  Classical (Non-Deep) ML
                  <ul>
                    <li>Linear Regression</li>
                    <li>Logistic Regression</li>
                    <li>Decision Trees / Random Forests</li>
                    <li>Support Vector Machines (SVM)</li>
                    <li>k-Nearest Neighbors (k-NN)</li>
                    <li>k-Means Clustering</li>
                    <li>Principal Component Analysis (PCA)</li>
                    <li>Hidden Markov Models (HMMs)</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Symbolic / Classical AI (Not Machine Learning)
              <ul>
                <li>Search & Planning (A*, Minimax, Dijkstra, MCTS)</li>
                <li>Constraint Satisfaction / Logic Programming</li>
                <li>Rule-Based / Expert Systems</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </>
  );
}
