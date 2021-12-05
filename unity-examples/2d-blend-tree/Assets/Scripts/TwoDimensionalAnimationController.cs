using UnityEngine;

public class TwoDimensionalAnimationController : MonoBehaviour
{
    Animator animator;
    float velocityZ = 0.0f;
    float velocityX = 0.0f;
    [SerializeField] private float acceleration = 2.0f;
    [SerializeField] private float decceleration = 2.0f;

    private const float MAX_WALK_VELOCITY = 0.5f;
    private const float MAX_RUN_VELOCITY = 2.0f;

    int velocityZHash;
    int velocityXHash;

    // Start is called before the first frame update
    void Start()
    {
        animator = GetComponent<Animator>();
        velocityZHash = Animator.StringToHash("VelocityZ");
        velocityXHash = Animator.StringToHash("VelocityX");
    }

    void changeVelocity(bool forwardPressed, bool leftPressed, bool rightPressed, bool runPressed, float currentMaxVelocity) {
        if (forwardPressed && velocityZ < currentMaxVelocity) {
            velocityZ += Time.deltaTime * acceleration;
        }

        if (leftPressed && velocityX > -currentMaxVelocity) {
            velocityX -= Time.deltaTime * acceleration;
        }    

        if (rightPressed && velocityX < currentMaxVelocity) {
            velocityX += Time.deltaTime * acceleration;
        }

        if (!forwardPressed && velocityZ > 0.0f) {
            velocityZ -= Time.deltaTime * decceleration;
        }

        if (!leftPressed && velocityX < 0.0f) {
            velocityX += Time.deltaTime * decceleration;
        }

        if (!rightPressed && velocityX > 0.0f) {
            velocityX -= Time.deltaTime * decceleration;
        }
    }

    void resetVelocity(bool forwardPressed, bool leftPressed, bool rightPressed) {
        if (!forwardPressed && velocityZ < 0.0f) {
            velocityZ = 0.0f;
        }

        if (!leftPressed && velocityZ < 0.0f) {
            velocityZ = 0.0f;
        }

        if (!leftPressed && !rightPressed && velocityX != 0.0f && (velocityX > -0.05f && velocityX < 0.05f)) {
            velocityX = 0.0f;
        }
    }

    void capVelocity(bool forwardPressed, bool leftPressed, bool rightPressed, bool runPressed, float currentMaxVelocity) {
        // FORWARD LOCKING (Locks at 0, 0.5, and 2.0)
        if (forwardPressed && runPressed && velocityZ > currentMaxVelocity) {
            velocityZ = currentMaxVelocity;
        }
        else if (forwardPressed && velocityZ > currentMaxVelocity) {
            velocityZ -= Time.deltaTime * decceleration;
            if (velocityZ < currentMaxVelocity && velocityZ < (currentMaxVelocity + 0.05f)) {
                velocityZ = currentMaxVelocity;
            }
        }
        else if (forwardPressed && velocityZ < currentMaxVelocity && velocityZ > (currentMaxVelocity - 0.05f)) {
            velocityZ = currentMaxVelocity;
        }
        
        // LEFT LOCKING (Locks at 0, -0.5, and -2.0)
        if (leftPressed && runPressed && velocityX < -currentMaxVelocity) {
            velocityX = -currentMaxVelocity;
        }
        else if (leftPressed && velocityX < -currentMaxVelocity) {
            velocityX += Time.deltaTime * decceleration;
            if (velocityX < -currentMaxVelocity && velocityX > (-currentMaxVelocity - 0.05f)) {
                velocityX = -currentMaxVelocity;
            }

        }
        else if (leftPressed && velocityX > -currentMaxVelocity && velocityX < (-currentMaxVelocity + 0.05f)) {
            velocityX = -currentMaxVelocity;
        }

        // RIGHT LOCKING (Locks at 0, 0.5, and 2.0)
        if (rightPressed && runPressed && velocityX > currentMaxVelocity) {
            velocityX = currentMaxVelocity;
        }
        else if (rightPressed && velocityX > currentMaxVelocity) {
            velocityX -= Time.deltaTime * decceleration;
            if (velocityX > currentMaxVelocity && velocityX < (currentMaxVelocity + 0.05f)) {
                velocityX = currentMaxVelocity;
            }

        }
        else if (rightPressed && velocityX < currentMaxVelocity && velocityX > (currentMaxVelocity - 0.05f)) {
            velocityX = currentMaxVelocity;
        }
    }

    // Update is called once per frame
    void Update()
    {
        bool forwardPressed = Input.GetKey(KeyCode.W);
        bool leftPressed = Input.GetKey(KeyCode.A);
        bool rightPressed = Input.GetKey(KeyCode.D);
        bool runPressed = Input.GetKey(KeyCode.LeftShift);

        float currentMaxVelocity = runPressed ? MAX_RUN_VELOCITY : MAX_WALK_VELOCITY;
            
        changeVelocity(forwardPressed, leftPressed, rightPressed, runPressed, currentMaxVelocity);
        resetVelocity(forwardPressed, leftPressed, rightPressed);
        capVelocity(forwardPressed, leftPressed, rightPressed, runPressed, currentMaxVelocity);

        animator.SetFloat(velocityZHash, velocityZ);
        animator.SetFloat(velocityXHash, velocityX);
    }
}
