from ultralytics import YOLO

if __name__ == '__main__':
    # Load a model
    model = YOLO('bottle+can_ver2_best.pt')

    # Predict the model
    model.predict('data/pet+kan.jpg', save=True, conf=0.5)
